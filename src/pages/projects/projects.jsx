import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import LPLayout from "../../components/layout/lp-layout";
import Loader from "../../components/loader/loader";
import { usePageLoading } from "../../context/LoadingContext";
import { useQuery } from "@apollo/client";
import PROJECT_ITEMS_QUERY from "../../gql-query/ProjectItemsQuery";
import { trackEvent } from "../../utils/analytics";

// Styled Components for Projects Page
const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  width: 100%;
  margin-top: 60px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 60px 40px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 80px 40px;
  }
`;

const ProjectCard = styled(NavLink)`
  display: block;
  text-decoration: none;
  width: 100%;
  cursor: pointer;
  opacity: 0;
  animation: fadeUp 0.8s ease forwards;
  animation-delay: ${(props) => props.delay || "0s"};

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 125%; /* 4:5 Aspect Ratio */
    overflow: hidden;
    background: #1a1a1a;
    margin-bottom: 20px;
    border-radius: 24px; /* Rounded corners for project cards */

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
      filter: grayscale(100%) brightness(0.9);
    }

    /* Overlay for consistent darker tone */
    &::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.2);
      transition: 0.4s ease;
    }
  }

  .project-info {
    display: flex;
    flex-direction: column;

    .project-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .project-number {
      font-family: 'Syne', sans-serif;
      font-size: 12px;
      color: #666;
      letter-spacing: 1px;
    }

    .project-type-badge {
      font-family: 'Poppins', sans-serif;
      font-size: 11px;
      color: #fd5a1e;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    h3 {
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: -0.5px;
      transition: color 0.3s ease;
      line-height: 1.2;
    }

    .project-category {
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      color: #888;
      font-weight: 300;
      margin-top: 5px;
      text-transform: capitalize;
    }
  }

  /* Hover Interaction */
  &:hover {
    .image-wrapper {
      img {
        transform: scale(1.05);
        filter: grayscale(0%) brightness(1);
      }
      &::after {
        background: rgba(0,0,0,0);
      }
    }

    .project-info h3 {
      color: #fd5a1e;
    }
  }
`;

const CategoryWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;

  button {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    padding: 8px 24px;
    border-radius: 40px;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s ease;

    &:hover, &.active {
      background: #fff;
      color: #000;
    }
  }
`;

const Projects = () => {
  const { data, loading } = useQuery(PROJECT_ITEMS_QUERY);
  const { setPageReady } = usePageLoading();
  const [loader, setLoader] = useState(true);
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All Projects');

  const handleLoaderDone = (val) => {
    setLoader(val);
    if (!val) setPageReady(true);
  };

  useEffect(() => {
    if (data && data.projectItemCollection) {
      setProjects(data.projectItemCollection.items);
    }
  }, [data]);

  // Derive unique project types for filter buttons
  const filterOptions = ['All Projects', ...Array.from(
    new Set(projects.map(p => p.projectType).filter(Boolean))
  )];

  const filtered = activeFilter === 'All Projects'
    ? projects
    : projects.filter(p => p.projectType === activeFilter);

  if (loader || loading) return <Loader setLoader={handleLoaderDone} />;

  return (
    <LPLayout
      title="Our Works"
      subtitle="A curated selection of our finest architectural visualizations and interior designs. Each project represents a unique challenge and a bespoke solution."
    >
      <CategoryWrapper>
        {filterOptions.map(option => (
          <button
            key={option}
            className={activeFilter === option ? 'active' : ''}
            onClick={() => {
              trackEvent('project_filter', { filter: option });
              setActiveFilter(option);
            }}
          >
            {option}
          </button>
        ))}
      </CategoryWrapper>

      <ProjectGrid>
        {filtered.map((item, index) => (
          <ProjectCard
            to={`/projects/${item.slug}`}
            key={item.slug || index}
            delay={`${index * 0.1}s`}
            onClick={() => trackEvent('project_click', {
              project_slug: item.slug,
              project_type: item.projectType,
              source: 'grid',
              position: index + 1,
            })}
          >
            <div className="image-wrapper">
              {item.heroImage && (
                <img src={item.heroImage.url} alt={item.title} loading="lazy" />
              )}
            </div>

            <div className="project-info">
              <div className="project-meta">
                <span className="project-number">{(index + 1).toString().padStart(2, '0')}</span>
                {item.projectType && (
                  <span className="project-type-badge">{item.projectType}</span>
                )}
              </div>
              <h3>{item.title}</h3>
              <div className="project-category">
                {item.category || item.projectType || 'Architectural Visualization'}
              </div>
            </div>
          </ProjectCard>
        ))}


      </ProjectGrid>
    </LPLayout>
  );
};

export default Projects;
